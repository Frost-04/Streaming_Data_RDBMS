package com.gaurav.microservices.streamingdata.repository;

import com.gaurav.microservices.streamingdata.entity.StreamColEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamColRepository extends JpaRepository<StreamColEntity, Long> {
}
