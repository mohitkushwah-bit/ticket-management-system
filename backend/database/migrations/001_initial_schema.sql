-- ============================================
-- Support Ticket Management System
-- Consolidated Schema
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create custom enum types
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'cancelled');

-- ============================================
-- Roles Table
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default roles
INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'Full access to all screens and management', '{
      "dashboard": { "read": true, "write": true },
      "tickets": { "read": true, "write": true },
      "kanban": { "read": true, "write": true },
      "users": { "read": true, "write": true },
      "roles": { "read": true, "write": true }
    }'::jsonb),
    ('agent', 'View-only access to tickets, dashboard, and kanban', '{
      "dashboard": { "read": true, "write": false },
      "tickets": { "read": true, "write": false },
      "kanban": { "read": true, "write": false },
      "users": { "read": false, "write": false },
      "roles": { "read": false, "write": false }
    }'::jsonb),
    ('user', 'Can create, edit tickets and change status', '{
      "dashboard": { "read": true, "write": false },
      "tickets": { "read": true, "write": true },
      "kanban": { "read": true, "write": true },
      "users": { "read": false, "write": false },
      "roles": { "read": false, "write": false }
    }'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tickets Table
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority NOT NULL DEFAULT 'medium',
    status ticket_status NOT NULL DEFAULT 'open',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    pr_link VARCHAR(2048),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Comments Table
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX idx_tickets_status_updated ON tickets(status, updated_at DESC);
CREATE INDEX idx_tickets_title_trgm ON tickets USING GIN (title gin_trgm_ops);
CREATE INDEX idx_tickets_description_trgm ON tickets USING GIN (description gin_trgm_ops);
CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Full-text search index
CREATE INDEX idx_tickets_search ON tickets USING GIN (
    to_tsvector('english', title || ' ' || description)
);

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
