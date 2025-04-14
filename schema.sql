
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Logs Table
CREATE TABLE daily_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, date)
);

-- Sleep Records Table
CREATE TABLE sleep_records (
    sleep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id UUID NOT NULL,
    sleep_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    wake_up_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sleep_duration DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (log_id) REFERENCES daily_logs(log_id) ON DELETE CASCADE,
    UNIQUE (log_id)
);

-- Journal Entries Table
CREATE TABLE journal_entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id UUID NOT NULL,
    text_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES daily_logs(log_id) ON DELETE CASCADE
);

-- Checklist Items Table
CREATE TABLE checklist_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id UUID NOT NULL,
    item_text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES daily_logs(log_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX idx_sleep_records_log_id ON sleep_records(log_id);
CREATE INDEX idx_journal_entries_log_id ON journal_entries(log_id);
CREATE INDEX idx_checklist_items_log_id ON checklist_items(log_id);
