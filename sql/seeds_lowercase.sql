INSERT INTO specimen (`name`)
VALUES ('Whole Blood'), ('Serum'), ('Plasma'), ('CSF'), ('Urine'), ('DBS'), ('WBC Pellet (~1% of the time)'), ('Other');

INSERT INTO transparency (`name`)
VALUES ('Clear'), ('Cloudy');

INSERT INTO tube_color (`name`)
VALUES ('WB Purple'), ('WB Green'), ('WB Yellow'), ('WB Red'), ('Serum'), ('Plasma'), ('DBS'), ('CSF'), ('Urine');

INSERT INTO visual_inspect (`name`)
VALUES ('Normal'), ('Hemolyzed'), ('Quantity Not Sufficient'), ('More than 5 Days from Date of Collection'), ('Wrong Collection Tube');

INSERT INTO `type` (`name`)
VALUES ('Serum'), ('Plasma');

INSERT INTO sample_color (`name`)
VALUES ('Yellow'), ('Brown'), ('Orange'), ('Red');

INSERT INTO `role` (`name`)
VALUES ('Technologist'), ('Accessioner'), ('Admin');

INSERT INTO lab (`name`)
VALUES ('Biochemical'), ('Molecular');

INSERT INTO `user` (`name`, `email`, `password`, `createdAt`, `updatedAt`, `role_id`) values ("Admin", "admin@bsv.com", "$2a$10$vRDQGqLEVmzgcrl.PvCFQujb49LPexuMDuSrid3RMPJahGRiDvl6m", now(), now(), 3)