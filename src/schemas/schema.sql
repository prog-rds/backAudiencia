DROP TABLE IF EXISTS Interactions; --Depends on UserStudies and Ads
DROP TABLE IF EXISTS UserStudies; --Depends on Users and VideoStudies
DROP TABLE IF EXISTS Ads; --Depends on VideoStudies and VideoAds
DROP TABLE IF EXISTS VideoStudies;
DROP TABLE IF EXISTS VideoAds; 
DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users ( 
	UserId TEXT PRIMARY KEY, 
	UserName TEXT,
	Pass TEXT,
	Salt TEXT,
	UserRole TEXT,
	Document TEXT,
	UserState TEXT
);

INSERT INTO Users (UserId, UserName, Pass, Salt, UserRole, Document, UserState)
VALUES 
(
	'6eddcbe1-a77b-451c-aa93-6f8de793150e2',
	'adminRds',
	'946c084628e6f251d0100ec57a32c92fc3a98c80572dd28eb4001db060a41246b6aa0e22e32a04b5a5339fd5e35f2b02cac926fb37308f3944b6baf3671d5d89',
	'efd944444ec6f8b7e9f6ee165dafa1e3',
	'SuperAdmin',
	'987654321',
	'Activo'
);

INSERT INTO Users (UserId, UserName, Pass, Salt, UserRole, Document, UserState)
VALUES 
(
	'd209ac19-0a8c-4c04-b133-85909fc19a32',
	'Fabian M.',
	'baace38fecb5e88382feefde7f316e25ab112c72d1f53beb8bf7f6cde16267ebff23b9c7e0488f56ba8435a797a33025ac9e86c2a432e2181e96de3cb16901b8',
	'a57cc5a03e82e940dbe6a88126632def',
	'Usuario',
	'321654987',
	'Activo' 
);


CREATE TABLE IF NOT EXISTS VideoStudies ( 
	StudyCode TEXT PRIMARY KEY, 
	VideoName TEXT,
	Duration TEXT,
	Link TEXT
);

CREATE TABLE IF NOT EXISTS VideoAds ( 
	VideoAdId INTEGER PRIMARY KEY, 
	VideoName TEXT,
	Duration TEXT,
	Link TEXT
);

CREATE TABLE IF NOT EXISTS Ads ( 
	AdId INTEGER PRIMARY KEY, 
	StudyCode TEXT,
	VideoAdId INTEGER,
	AdEntryTime TEXT,
	SkipEntryTime TEXT,
	IsSecundary TEXT,
	FOREIGN KEY (StudyCode) REFERENCES VideoStudies(StudyCode),
	FOREIGN KEY (VideoAdId) REFERENCES VideoAds(VideoAdId)
);


CREATE TABLE IF NOT EXISTS UserStudies ( 
	UserStudyId INTEGER PRIMARY KEY, 
	UserId TEXT,
	StudyCode TEXT,
	StudyDate TEXT,
	StudyTime TEXT,
	FOREIGN KEY (UserId) REFERENCES Users(UserId),
	FOREIGN KEY (StudyCode) REFERENCES VideoStudies(StudyCode)
);

CREATE TABLE IF NOT EXISTS Interactions ( 
	InteractionId INTEGER PRIMARY KEY, 
	UserStudyId INTEGER,
	AdId INTEGER,
	ViewTime TEXT,
	WasSkipped TEXT,
	FOREIGN KEY (UserStudyId) REFERENCES UserStudies(UserStudyId),
	FOREIGN KEY (AdId) REFERENCES Ads(AdId)
);

