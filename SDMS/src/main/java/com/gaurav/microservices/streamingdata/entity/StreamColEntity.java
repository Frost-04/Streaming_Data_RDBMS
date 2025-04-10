package com.gaurav.microservices.streamingdata.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stream_cols")
public class StreamColEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long streamColId;

    @ManyToOne
    @JoinColumn(name = "stream_id", referencedColumnName = "streamId", nullable = false)
    private StreamMasterEntity stream;

    private String streamColName;
    private String streamColDataType;

    // Getters and Setters

    public Long getStreamColId() {
        return streamColId;
    }

    public void setStreamColId(Long streamColId) {
        this.streamColId = streamColId;
    }

    public StreamMasterEntity getStream() {
        return stream;
    }

    public long getStreamId() {
        return stream.getStreamId();
    }

    public void setStream(StreamMasterEntity stream) {
        this.stream = stream;
    }

    public String getStreamColName() {
        return streamColName;
    }
    public void setStreamColName(String streamColName) {
        this.streamColName = streamColName;
    }

    public String getStreamColDataType() {
        return streamColDataType;
    }
    public void setStreamColDataType(String streamColDataType) {
        this.streamColDataType = streamColDataType;
    }
}
