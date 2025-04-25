package com.gaurav.microservices.inputmonitor.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InsertionHelperService {

    private final JdbcTemplate jdbcTemplate;
    // Hardcoded CSV file location
    public String getDataSourcePathById(int streamId) {
        try {
            String sql = "SELECT data_source_path FROM stream_master WHERE stream_id = ?";
            return jdbcTemplate.queryForObject(sql, String.class, streamId);
        } catch (Exception e) {
            throw new RuntimeException("Could not retrieve data source path for ID " + streamId + ": " + e.getMessage(), e);
        }
    }

    public InsertionHelperService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> insertRowFromCsv(String tableName, int streamId, List<Map<String, Object>> columns, Map<String, String> csvRow) {
        Map<String, Object> insertedValues = new HashMap<>();
        List<String> columnNames = new ArrayList<>();
        List<Object> values = new ArrayList<>();

        for (Map<String, Object> column : columns) {
            String columnName = (String) column.get("COLUMN_NAME");
            String dataType = (String) column.get("TYPE_NAME");
            String columnDef = column.get("COLUMN_DEF") != null ? column.get("COLUMN_DEF").toString() : null;
            boolean isAutoIncrement = "YES".equals(column.get("IS_AUTOINCREMENT"));

            // Skip auto-increment columns or columns with default timestamp
            if (isAutoIncrement || (columnDef != null && columnDef.toUpperCase().contains("CURRENT_TIMESTAMP"))) {
                continue;
            }

            // Get value from CSV or use default if not found
            String csvValue = csvRow.get(columnName);
            Object value;

            if (csvValue != null && !csvValue.isEmpty()) {
                value = convertToAppropriateType(csvValue, dataType);
            } else {
                System.out.println("generating default value");
                value = generateDefaultValue(dataType, columnName);
            }

            columnNames.add(columnName);
            values.add(value);
            insertedValues.put(columnName, value);
        }

        // Rest of the method remains the same
        if (columnNames.isEmpty()) {
            // If only auto-increment columns, do a blank insert
            jdbcTemplate.update("INSERT INTO " + tableName + " DEFAULT VALUES");
        } else {
            // Create and execute SQL
            String sql = "INSERT INTO " + tableName + " (" +
                    String.join(", ", columnNames) + ") VALUES (" +
                    columnNames.stream().map(c -> "?").collect(Collectors.joining(", ")) + ")";

            jdbcTemplate.update(sql, values.toArray());
        }
        updateSummaryStatistics(tableName, streamId, insertedValues);
        return insertedValues;
    }

    public List<Map<String, String>> readCsvData(int streamId) throws IOException {
        List<Map<String, String>> result = new ArrayList<>();
        String csvFilePath = getDataSourcePathById(streamId);

        if (csvFilePath == null || csvFilePath.isEmpty()) {
            throw new IOException("No data source path found for stream ID: " + streamId);
        }

        try (Reader reader = new FileReader(csvFilePath)) {
            CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader);

            for (CSVRecord record : csvParser) {
                Map<String, String> row = new HashMap<>();
                csvParser.getHeaderNames().forEach(header ->
                        row.put(header, record.get(header))
                );
                result.add(row);
            }
        }

        return result;
    }

    /**
     * Updates summary statistics in the summary table after inserting a row
     */
    public void updateSummaryStatistics(String tableName, int streamId, Map<String, Object> insertedValues) {
        // Construct summary table name
        String summaryTableName = tableName + "_summary";

        try {
            // First, get all column names that exist in the summary table for this stream_id
            String columnQuery = "SELECT column_name FROM " + summaryTableName + " WHERE stream_id = ?";
            List<String> existingColumns = jdbcTemplate.queryForList(columnQuery, String.class, streamId);

            // For each inserted column value that is numeric and exists in summary table
            for (Map.Entry<String, Object> entry : insertedValues.entrySet()) {
                String columnName = entry.getKey();
                Object value = entry.getValue();

                // Only process numeric values for columns that exist in the summary table
                if (value instanceof Number && existingColumns.contains(columnName)) {
                    double numericValue = ((Number) value).doubleValue();

                    try {
                        // Get the current values for this column
                        String statsSql = "SELECT id, sum, avg, max, min, row_count FROM " + summaryTableName +
                                " WHERE stream_id = ? AND column_name = ?";
                        Map<String, Object> result = jdbcTemplate.queryForMap(statsSql, streamId, columnName);

                        Long id = (Long) result.get("id");
                        Double currentSum = (Double) result.get("sum");
                        Double currentAvg = (Double) result.get("avg");
                        Double currentMax = (Double) result.get("max");
                        Double currentMin = (Double) result.get("min");
                        Integer rowCount = (Integer) result.get("row_count");

                        double newSum = (currentSum != null ? currentSum : 0) + numericValue;
                        double newAvg = newSum / (rowCount + 1);
                        double newMax = currentMax != null ? Math.max(currentMax, numericValue) : numericValue;
                        double newMin = currentMin != null ? Math.min(currentMin, numericValue) : numericValue;
                        long newRowCount = rowCount + 1;

                        String updateSql = "UPDATE " + summaryTableName +
                                " SET sum = ?, avg = ?, max = ?, min = ?, row_count = ? WHERE id = ?";
                        jdbcTemplate.update(updateSql, newSum, newAvg, newMax, newMin, newRowCount, id);

                    } catch (Exception e) {
                        System.err.println("Error updating statistics for column " + columnName + ": " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error retrieving columns from summary table: " + e.getMessage());
        }
    }

    public Object convertToAppropriateType(String value, String dataType) {
        dataType = dataType.toUpperCase();

        try {
            if (dataType.contains("VARCHAR") || dataType.contains("CHAR") || dataType.contains("TEXT")) {
                return value;
            } else if (dataType.contains("INT")) {
                return Integer.parseInt(value);
            } else if (dataType.contains("DECIMAL") || dataType.contains("NUMERIC") ||
                    dataType.contains("FLOAT") || dataType.contains("DOUBLE")) {
                return Double.parseDouble(value);
            } else if (dataType.contains("DATE")) {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                return new java.sql.Date(format.parse(value).getTime());
            } else if (dataType.contains("TIME")) {
                SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
                return new java.sql.Time(format.parse(value).getTime());
            } else if (dataType.contains("TIMESTAMP")) {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                return new java.sql.Timestamp(format.parse(value).getTime());
            } else if (dataType.contains("BOOLEAN") || dataType.contains("BIT")) {
                return Boolean.parseBoolean(value);
            } else {
                return value;
            }
        } catch (NumberFormatException | ParseException e) {
            return value;
        }
    }

    public List<Map<String, Object>> getTableColumns(String tableName) {
        return jdbcTemplate.execute((Connection conn) -> {
            List<Map<String, Object>> columns = new ArrayList<>();
            DatabaseMetaData metaData = conn.getMetaData();

            try (ResultSet rs = metaData.getColumns(null, null, tableName, null)) {
                while (rs.next()) {
                    Map<String, Object> column = new HashMap<>();
                    column.put("COLUMN_NAME", rs.getString("COLUMN_NAME"));
                    column.put("TYPE_NAME", rs.getString("TYPE_NAME"));
                    column.put("IS_NULLABLE", rs.getString("IS_NULLABLE"));
                    column.put("IS_AUTOINCREMENT", rs.getString("IS_AUTOINCREMENT"));
                    column.put("COLUMN_DEF", rs.getString("COLUMN_DEF"));
                    columns.add(column);
                }
            }
            return columns;
        });
    }
    public Object generateDefaultValue(String dataType, String columnName) {
        dataType = dataType.toUpperCase();

        if (dataType.contains("VARCHAR") || dataType.contains("CHAR") || dataType.contains("TEXT")) {
            return "Sample_" + columnName;
        } else if (dataType.contains("INT")) {
            return 1;
        } else if (dataType.contains("DECIMAL") || dataType.contains("NUMERIC") ||
                dataType.contains("FLOAT") || dataType.contains("DOUBLE")) {
            return 1.0;
        } else if (dataType.contains("DATE")) {
            return new java.sql.Date(System.currentTimeMillis());
        } else if (dataType.contains("TIME")) {
            return new java.sql.Time(System.currentTimeMillis());
        } else if (dataType.contains("TIMESTAMP")) {
            return new java.sql.Timestamp(System.currentTimeMillis());
        } else if (dataType.contains("BOOLEAN") || dataType.contains("BIT")) {
            return true;
        } else {
            return "Default_" + columnName;
        }
    }

    public Map<String, Integer> getStreamParametersById(Integer streamId) {
        Map<String, Integer> params = new HashMap<>();

        try {
            String windowSizeQuery = "SELECT window_size FROM stream_master WHERE stream_id = ?";
            Integer windowSize = jdbcTemplate.queryForObject(windowSizeQuery, Integer.class, streamId);

            String windowVelocityQuery = "SELECT window_velocity FROM stream_master WHERE stream_id = ?";
            Integer windowVelocity = jdbcTemplate.queryForObject(windowVelocityQuery, Integer.class, streamId);

            params.put("window_size", windowSize != null ? windowSize : 2);
            params.put("window_velocity", windowVelocity != null ? windowVelocity : 5);
        } catch (Exception e) {
            params.put("window_size", 2);
            params.put("window_velocity", 5);
            System.out.println("Could not retrieve stream parameters: " + e.getMessage());
        }

        return params;
    }

    public String getStreamNameById(int streamId) {
        try {
            String sql = "SELECT stream_name FROM stream_master WHERE stream_id = ?";
            return jdbcTemplate.queryForObject(sql, String.class, streamId);
        } catch (Exception e) {
            throw new RuntimeException("Could not retrieve stream name for ID " + streamId + ": " + e.getMessage(), e);
        }
    }

    public int getCurrentRowCount(String tableName) {
        String countSql = "SELECT COUNT(*) FROM " + tableName;
        return jdbcTemplate.queryForObject(countSql, Integer.class);
    }

    public void deleteOldestRows(String tableName, int rowCount) {
        if (rowCount <= 0) return;

        String deleteSQL = "DELETE FROM " + tableName +
                " WHERE id IN (SELECT id FROM (SELECT id FROM " + tableName +
                " ORDER BY id ASC LIMIT ?) as temp_table)";

        jdbcTemplate.update(deleteSQL, rowCount);
        System.out.printf("Deleted %d oldest rows from %s to maintain window size%n",
                rowCount, tableName);
    }
}