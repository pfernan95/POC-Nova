-- roles definition

CREATE TABLE [roles] (
    [id] INTEGER NOT NULL PRIMARY KEY,
    [role] TEXT(6) NOT NULL
);


-- users definition

CREATE TABLE users (
	id TEXT(36),
	name TEXT(50),
	surname TEXT(50),
	email TEXT(50),
	password_hash TEXT(61),
	CONSTRAINT users_PK PRIMARY KEY (id),
	CONSTRAINT users_UN UNIQUE (email)
);


-- nominations definition

CREATE TABLE nominations (
	id TEXT(36),
	name TEXT(50),
	surname TEXT(50),
	email TEXT(50),
	description TEXT(300),
	involvement INTEGER,
	overall INTEGER,
	status TEXT(8),
	user_id TEXT(36),
	CONSTRAINT nominations_PK PRIMARY KEY (id),
	CONSTRAINT nominations_FK FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX nominations_email_IDX ON nominations (email);


-- user_roles definition

CREATE TABLE user_roles (
	id TEXT(36),
	role_id INTEGER,
	user_id TEXT(36),
	CONSTRAINT USER_ROLES_PK PRIMARY KEY (id),
	CONSTRAINT user_roles_FK FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_FK_1 FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);