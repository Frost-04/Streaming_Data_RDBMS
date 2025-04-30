package com.sushma.output.OutputMonitor.controller;

import com.sushma.output.OutputMonitor.Repository.StreamInfoRepository;
import com.sushma.output.OutputMonitor.dto.StreamInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/ingestion")
public class StreamInfoController {
    @Autowired
    private StreamInfoRepository streamInfoRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/stream-master")
    public List<StreamInfo> getAllStreams() {
        return streamInfoRepository.findAll();
    }

}
