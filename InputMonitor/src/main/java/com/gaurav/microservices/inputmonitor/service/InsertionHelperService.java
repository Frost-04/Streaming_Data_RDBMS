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
    private static final String CSV_FILE_PATH = "C:/Users/gaura/Downloads/data.csv";

    public InsertionHelperService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> insertRowFromCsv(String tableName, List<Map<String, Object>> columns, Map<String, String> csvRow) {
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

        return insertedValues;
    }

    public List<Map<String, String>> readCsvData() throws IOException {
        List<Map<String, String>> result = new ArrayList<>();

        try (Reader reader = new FileReader(CSV_FILE_PATH)) {
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
            // If conversion fails, return the original string
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
        // Generate default values based on data type (kept for fallback)
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

    public Map<String, Integer> getStreamParameters(String streamName) {
        Map<String, Integer> params = new HashMap<>();

        try {
            String sql = "SELECT window_size, window_velocity FROM stream_master WHERE stream_name = ?";
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, streamName);

            params.put("window_size", ((Number) result.get("window_size")).intValue());
            params.put("window_velocity", ((Number) result.get("window_velocity")).intValue());
        } catch (Exception e) {
            // If no record found or any error, use default values
            params.put("window_size", 2);
            params.put("window_velocity", 5);
            System.out.println("Could not retrieve stream parameters: " + e.getMessage());
        }

        return params;
    }
}