package com.gaurav.microservices.streamingdata.controller;

import com.gaurav.microservices.streamingdata.service.FileProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileProcessingService fileProcessingService;

    @PostMapping("/process")
    public String processFile() {
        fileProcessingService.processFile();
        return "File processed successfully!";
    }
}
