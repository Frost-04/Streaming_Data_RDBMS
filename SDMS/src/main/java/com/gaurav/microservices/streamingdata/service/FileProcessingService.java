package com.gaurav.microservices.streamingdata.service;


import com.gaurav.microservices.streamingdata.entity.TextData;
import com.gaurav.microservices.streamingdata.repository.TextDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileProcessingService {

    @Autowired
    private TextDataRepository textDataRepository;

    private static final String FILE_PATH = "..\\text.txt";


    private long lastFilePointer = 0;

    public void processFile() {
        Path path = Paths.get(FILE_PATH);
        System.out.println("Current working directory: " + System.getProperty("user.dir"));

        try (RandomAccessFile file = new RandomAccessFile(path.toFile(), "r")) {
            file.seek(lastFilePointer);

            while (true) {
                if (file.getFilePointer() < file.length()) {
                    String line;
                    while ((line = file.readLine()) != null) {
                        String[] parts = line.split(";");
                        if (parts.length >= 2) {
                            TextData data = new TextData();
                            data.setContent(parts[0].trim());  // content1
                            data.setContent2(parts[1].trim()); // content2
                            textDataRepository.save(data);
                        } else {
                            System.out.println("Skipping line (not enough parts): " + line);
                        }
                    }
                    lastFilePointer = file.getFilePointer();
                }

                Thread.sleep(1000);
            }
        } catch (IOException | InterruptedException exception) {
            exception.printStackTrace();
        }
    }
}