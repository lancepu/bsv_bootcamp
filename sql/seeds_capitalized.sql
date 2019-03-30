INSERT INTO Specimen (`name`)
VALUES ('Whole Blood'), ('Serum'), ('Plasma'), ('CSF'), ('Urine'), ('DBS'), ('WBC Pellet (~1% of the time)'), ('Other');

INSERT INTO Transparency (`name`)
VALUES ('Clear'), ('Cloudy');

INSERT INTO Tube_Color (`name`)
VALUES ('WB Purple'), ('WB Green'), ('WB Yellow'), ('WB Red'), ('Serum'), ('Plasma'), ('DBS'), ('CSF'), ('Urine');

INSERT INTO Visual_Inspect (`name`)
VALUES ('Normal'), ('Hemolyzed'), ('Quantity Not Sufficient'), ('More than 5 Days from Date of Collection'), ('Wrong Collection Tube');

INSERT INTO `Type` (`name`)
VALUES ('Serum'), ('Plasma');

INSERT INTO Sample_Color (`name`)
VALUES ('Yellow'), ('Brown'), ('Orange'), ('Red');

INSERT INTO `Role` (`name`)
VALUES ('Technologist'), ('Accessioner'), ('Admin');

INSERT INTO Lab (`name`)
VALUES ('Biochemical'), ('Molecular');

INSERT INTO `User` (`name`, `email`, `password`, `createdAt`, `updatedAt`, `role_id`) values ("Admin", "admin@bsv.com", "$2a$10$vRDQGqLEVmzgcrl.PvCFQujb49LPexuMDuSrid3RMPJahGRiDvl6m", now(), now(), 3)