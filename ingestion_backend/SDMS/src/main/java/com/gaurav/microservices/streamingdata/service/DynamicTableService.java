package com.gaurav.microservices.streamingdata.service;

import com.gaurav.microservices.streamingdata.entity.StreamColEntity;
import com.gaurav.microservices.streamingdata.entity.StreamMasterEntity;
import com.gaurav.microservices.streamingdata.repository.StreamColRepository;
import com.gaurav.microservices.streamingdata.repository.StreamMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DynamicTableService {

    @Autowired
    private StreamColRepository streamColRepository;

    @Autowired
    private StreamMasterRepository streamMasterRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void createDynamicTables() {
        // Get all stream masters
        List<StreamMasterEntity> streamMasters = streamMasterRepository.findAll();

        for (StreamMasterEntity streamMaster : streamMasters) {
            // Use streamId instead of the entity object
            Long streamId = streamMaster.getStreamId();
            List<StreamColEntity> columns = streamColRepository.findByStream_StreamId(streamId);

            if (!columns.isEmpty()) {
                createTableForStream(streamMaster, columns);
            }
        }
    }

    private void createTableForStream(StreamMasterEntity streamMaster, List<StreamColEntity> columns) {
        // Generate table name based on stream name
        String tableName = "sdb_" + streamMaster.getStreamName().toLowerCase().replaceAll("\\s+", "_");

        // Build create table SQL
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE IF NOT EXISTS ").append(tableName).append(" (\n");
        sql.append("  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n");

        // Add columns based on metadata
        for (int i = 0; i < columns.size(); i++) {
            StreamColEntity col = columns.get(i);
            String columnName = col.getStreamColName().toLowerCase().replaceAll("\\s+", "_");
            String dataType = mapToSqlDataType(col.getStreamColDataType());

            sql.append("  ").append(columnName).append(" ").append(dataType);
            if (i < columns.size() - 1) {
                sql.append(",");
            }
            sql.append("\n");
        }

        // Add timestamp column
        sql.append(",  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n");
        sql.append(")");

        // Execute the SQL
        jdbcTemplate.execute(sql.toString());
    }

    private String mapToSqlDataType(String dataType) {
        if (dataType == null) return "VARCHAR(255)";

        return switch (dataType.toLowerCase()) {
                case "string" -> "VARCHAR(255)";
            case "integer" -> "INT";
            case "long" -> "BIGINT";
            case "double" -> "DOUBLE";
            case "float" -> "FLOAT";
            case "boolean" -> "BOOLEAN";
            case "date" -> "DATE";
            case "timestamp" -> "TIMESTAMP";
            default -> "VARCHAR(255)";
        };
    }


    public void createDynamicTableForStream(Long streamId) {
        StreamMasterEntity streamMaster = streamMasterRepository.findById(streamId)
                .orElseThrow(() -> new RuntimeException("Stream not found"));

        List<StreamColEntity> columns = streamColRepository.findByStream_StreamId(streamId);

        if (!columns.isEmpty()) {
            createTableForStream(streamMaster, columns);
        }
    }

}