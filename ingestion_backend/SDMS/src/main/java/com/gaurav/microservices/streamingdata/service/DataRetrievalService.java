package com.gaurav.microservices.streamingdata.service;

import com.gaurav.microservices.streamingdata.entity.DynamicTableMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DataRetrievalService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getStreamColsTableData(Long streamId) {
        String sql = "SELECT * FROM stream_cols where stream_id=?";
        return jdbcTemplate.queryForList(sql, streamId);
    }
    public List<Map<String, Object>> getStreamQueriesTableData(Long streamId) {
        String sql = "SELECT * FROM stream_queries WHERE stream_id=?";
        return jdbcTemplate.queryForList(sql, streamId);
    }
}