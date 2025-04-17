package com.gaurav.microservices.streamingdata.repository;

import com.gaurav.microservices.streamingdata.entity.StreamMasterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamMasterRepository extends JpaRepository<StreamMasterEntity, Long> {
}
