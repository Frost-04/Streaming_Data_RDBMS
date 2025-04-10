create database SDMSDB;
use sdmsdb;
CREATE TABLE stream_master (
    stream_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stream_name VARCHAR(255) NOT NULL,
    window_type VARCHAR(50),
    window_size INT,
    window_velocity INT
);

CREATE TABLE stream_cols (
    stream_col_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stream_id BIGINT UNSIGNED NOT NULL,
    stream_col_data_type VARCHAR(50),
    FOREIGN KEY (stream_id) REFERENCES stream_master(stream_id) ON DELETE CASCADE
);

CREATE TABLE stream_queries (
    query_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stream_id BIGINT UNSIGNED NOT NULL,
    stream_col_id BIGINT UNSIGNED NOT NULL,
    agg_function VARCHAR(50),
    FOREIGN KEY (stream_id) REFERENCES stream_master(stream_id) ON DELETE CASCADE,
    FOREIGN KEY (stream_col_id) REFERENCES stream_cols(stream_col_id) ON DELETE CASCADE
);
drop table stream_master;