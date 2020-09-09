CREATE DATABASE phonebook
ENCODING = UTF8;

-- *******************

CREATE TABLE IF NOT EXISTS accounts
(
	id_accounts SERIAL PRIMARY KEY,
	user_name VARCHAR(50) NOT NULL,
	user_password VARCHAR(50) NOT NULL
);

CREATE UNIQUE INDEX accounts_user_name
ON accounts(user_name);

-- *******************

CREATE TABLE IF NOT EXISTS contacts
(
	id_contacts SERIAL PRIMARY KEY,
	id_accounts INT NOT NULL,
	name VARCHAR(50) NOT NULL,
	nickname VARCHAR(50) DEFAULT NULL,
	surname VARCHAR(50) DEFAULT NULL
);

ALTER TABLE contacts
ADD CONSTRAINT contacts_idAcount_accounts_idAcount
FOREIGN KEY (id_accounts)
REFERENCES accounts(id_accounts);

-- *******************

CREATE TABLE IF NOT EXISTS phones
(
	id_phones SERIAL PRIMARY KEY,
	id_contacts INT NOT NULL,
	phone_number VARCHAR(25) NOT NULL
);

ALTER TABLE phones
ADD CONSTRAINT phones_idContact_contacts_idContact
FOREIGN KEY (id_contacts)
REFERENCES contacts(id_contacts);
