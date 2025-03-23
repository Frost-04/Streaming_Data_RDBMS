package com.gaurav.microservices.streamingdata.repository;


import com.gaurav.microservices.streamingdata.entity.TextData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TextDataRepository extends JpaRepository<TextData, Long> {
}