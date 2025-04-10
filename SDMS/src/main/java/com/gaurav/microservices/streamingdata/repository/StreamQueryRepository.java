package com.gaurav.microservices.streamingdata.repository;

import com.gaurav.microservices.streamingdata.entity.StreamQueryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamQueryRepository extends JpaRepository<StreamQueryEntity, Long> {
}
