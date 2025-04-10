package com.gaurav.microservices.streamingdata.repository;

import com.gaurav.microservices.streamingdata.entity.StreamColEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StreamColRepository extends JpaRepository<StreamColEntity, Long> {
    List<StreamColEntity> findByStream_StreamId(Long streamId);
}
