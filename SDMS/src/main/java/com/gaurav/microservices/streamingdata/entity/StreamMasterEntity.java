package com.gaurav.microservices.streamingdata.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stream_master")
public class StreamMasterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stream_id")
    private Long streamId;

    @Column(name = "stream_name", nullable = false)
    private String streamName;
    private String windowType;
    private Integer windowSize;
    private Integer windowVelocity;

    // Getters and Setters

    public Long getStreamId() {
        return streamId;
    }

    public void setStreamId(Long streamId) {
        this.streamId = streamId;
    }

    public String getStreamName() {
        return streamName;
    }

    public void setStreamName(String streamName) {
        this.streamName = streamName;
    }

    public String getWindowType() {
        return windowType;
    }

    public void setWindowType(String windowType) {
        this.windowType = windowType;
    }

    public Integer getWindowSize() {
        return windowSize;
    }

    public void setWindowSize(Integer windowSize) {
        this.windowSize = windowSize;
    }

    public Integer getWindowVelocity() {
        return windowVelocity;
    }

    public void setWindowVelocity(Integer windowVelocity) {
        this.windowVelocity = windowVelocity;
    }
}
