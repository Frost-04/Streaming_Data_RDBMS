package com.gaurav.microservices.inputmonitor.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InsertionService {

    private final InsertionHelperService helperService;

    public InsertionService(InsertionHelperService helperService) {
        this.helperService = helperService;
    }
    public Map<String, Integer> getStreamParametersById(Integer streamId) {
        return helperService.getStreamParametersById(streamId);
    }


    public Map<String, Object> insertRowsInBatches(int streamId, String tableName, int windowSize, int windowVelocity) {
        // for anti sql injections
        if (!tableName.matches("[a-zA-Z0-9_]+")) {
            throw new IllegalArgumentException("Invalid table name");
        }

        // to get details about columns
        List<Map<String, Object>> columns = helperService.getTableColumns(tableName);
        if (columns.isEmpty()) {
            throw new IllegalArgumentException("Table not found or has no columns");
        }

        try {
            // Read all data from CSV
            List<Map<String, String>> allCsvData = helperService.readCsvData(streamId);
            if (allCsvData.isEmpty()) {
                throw new IllegalArgumentException("CSV file empty or could not be read");
            }
            Map<String, Object> result = new HashMap<>();
            List<Map<String, Object>> allInsertedRows = new ArrayList<>();
            int rowsProcessed = 0;
            int totalRows = allCsvData.size();

            int currentRowCount = helperService.getCurrentRowCount(tableName);


            while (rowsProcessed < totalRows) {
                int rowsToInsert = Math.min(windowVelocity, totalRows - rowsProcessed);

                // Get current batch
                List<Map<String, String>> batchData = allCsvData.subList(rowsProcessed, rowsProcessed + rowsToInsert);

                // this will delete the rows to keep the window size constant
                int totalAfterInsert = currentRowCount + rowsToInsert;
                if (totalAfterInsert > windowSize) {
                    int rowsToDelete = totalAfterInsert - windowSize;
                    helperService.deleteOldestRows(tableName, rowsToDelete);
                    currentRowCount -= rowsToDelete;
                }

                List<Map<String, Object>> batchInsertedRows = new ArrayList<>();
                for (Map<String, String> csvRow : batchData) {
                    Map<String, Object> insertedValues = helperService.insertRowFromCsv(tableName, streamId, columns, csvRow);
                    batchInsertedRows.add(insertedValues);
                    allInsertedRows.add(insertedValues);
                    currentRowCount++;
                }

                //this will send the
                helperService.updateBatchSummaryStatistics(tableName, streamId, batchInsertedRows);

                //calling service to put entry in tick table
                int windowStartId = rowsProcessed;
                int windowEndId = rowsProcessed + rowsToInsert - 1;
                helperService.createTickEntry(tableName, streamId, windowStartId, windowEndId);


                rowsProcessed += rowsToInsert;
                System.out.printf("Inserted %d rows (total: %d/%d) - Table size: %d/%d%n",
                        rowsToInsert, rowsProcessed, totalRows, currentRowCount, windowSize);

                // Wait for 1 second before the next batch
                if (rowsProcessed < totalRows) {
                    try {
                        Thread.sleep(1000); // 1 second delay
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Batch processing interrupted", e);
                    }
                }
            }

            result.put("message", allInsertedRows.size() + " row(s) inserted successfully");
            result.put("table", tableName);
            result.put("inserted_data", allInsertedRows);
            result.put("window_size", windowSize);
            result.put("window_velocity", windowVelocity);
            result.put("final_row_count", currentRowCount);

            return result;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file: " + e.getMessage(), e);
        }
    }

    public String getStreamNameById(int streamId) {
        return helperService.getStreamNameById(streamId);
    }
}