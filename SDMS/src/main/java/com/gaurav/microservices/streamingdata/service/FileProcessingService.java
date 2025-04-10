package com.gaurav.microservices.streamingdata.service;


import com.gaurav.microservices.streamingdata.entity.StreamColEntity;
import com.gaurav.microservices.streamingdata.entity.StreamMasterEntity;
import com.gaurav.microservices.streamingdata.entity.StreamQueryEntity;
import com.gaurav.microservices.streamingdata.entity.TextData;
import com.gaurav.microservices.streamingdata.repository.TextDataRepository;
import com.gaurav.microservices.streamingdata.repository.StreamColRepository;
import com.gaurav.microservices.streamingdata.repository.StreamMasterRepository;
import com.gaurav.microservices.streamingdata.repository.StreamQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileProcessingService {

    @Autowired
    private TextDataRepository textDataRepository;
    @Autowired
    private StreamMasterRepository streamMasterRepository;

    @Autowired
    private StreamColRepository streamColRepository;

    @Autowired
    private StreamQueryRepository streamQueryRepository;

    public void saveStreamMaster(StreamMasterEntity streamMaster) {
        streamMasterRepository.save(streamMaster);
    }

    public boolean saveStreamCol(StreamColEntity streamCol) {
        if(streamMasterRepository.existsById(streamCol.getStreamId())) {
            streamColRepository.save(streamCol);
            return true;
        }
        return false;
    }

    public boolean saveStreamQuery(StreamQueryEntity streamQuery) {
        if(streamMasterRepository.existsById(streamQuery.getStreamId())
                && streamColRepository.existsById(streamQuery.getStreamColId())) {
            streamQueryRepository.save(streamQuery);
            return true;
        }
        return false;

    }
}