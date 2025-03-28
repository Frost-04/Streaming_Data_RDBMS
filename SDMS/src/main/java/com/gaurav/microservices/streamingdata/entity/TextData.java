package com.gaurav.microservices.streamingdata.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "text_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TextData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content")
    private String content;
    @Column(name = "content2")
    private String content2;

}


