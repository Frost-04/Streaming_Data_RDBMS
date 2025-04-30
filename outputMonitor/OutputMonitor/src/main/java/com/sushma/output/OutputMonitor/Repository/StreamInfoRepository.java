package com.sushma.output.OutputMonitor.Repository;

import com.sushma.output.OutputMonitor.dto.StreamInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamInfoRepository extends JpaRepository<StreamInfo, Long> {
}
