export function generateZebraTemplate(
  data,
  printQuantity,
  lab = "Biochemical"
) {
  const { labno, firstName, lastName, received, dob } = data;
  switch (lab) {
    case "Molecular":
      const modifyLabNo = labno.replace(/\D/g, "");
      return `^XA
      ^PQ${printQuantity}
      ^LH40,30
      ^FO30,20
      ^JMA^FS
      ^GB420,420,3^FS
      ^FO280,280^GB170,170,3^FS
      ^FO30,280^GB280,0,3^FS
      ^FO50,50^ADN,45,25^FD${firstName}^FS
      ^FO50,105^ADN,45,25^FD${lastName}^FS
      ^FO50,165^ADN,45,25^FD${modifyLabNo}_10^FS
      ^FO30,220^GB420,0,3^FS
      ^FO50,230^ADN,45,25^FDDOB:^FS^FO200,235^ADN,43,24^FD${dob}^FS
      ^FO50,290^ADN,45,25^FDRECD :^FS
      ^FO40,350^ADN,43,24^FD${received}^FS
      ^FO40,405^ADN,30,20^FD*SEMA4*^FS
      ^FO295,295
      ^BXN,7,200
      ^FD${modifyLabNo}_10^FS
      ^LH550,30
      ^FO30,20
      ^GB420,420,3^FS
      ^FO280,280^GB170,170,3^FS
      ^FO30,280^GB280,0,3^FS
      ^FO50,50^ADN,45,25^FD${firstName}^FS
      ^FO50,105^ADN,45,25^FD${lastName}^FS
      ^FO50,165^ADN,45,25^FD${modifyLabNo}_20^FS
      ^FO30,220^GB420,0,3^FS
      ^FO50,230^ADN,45,25^FDDOB:^FS^FO200,235^ADN,43,24^FD${dob}^FS
      ^FO50,290^ADN,45,25^FDRECD :^FS
      ^FO40,350^ADN,43,24^FD${received}^FS
      ^FO40,405^ADN,30,20^FD*SEMA4*^FS
      ^FO295,295
      ^BXN,7,200
      ^FD${modifyLabNo}_20^FS 
      ^XZ`;
    default:
      return `^XA
      ^MUd,300,300
      ^PQ${printQuantity}
      ^LH5,5
      ^JMA^FS
      ^FO50,5
      ^FO300,10^BY2
      ^BCN,120,N,N,N
      ^FD${labno}^FS
      ^FO250,145^ADN,35,15^FD${labno} ^FS
      ^FO200,185^ADN,15,5^FDRE:^FS
      ^FO255,185^ADN, 15,5^FD${received} ^FS
      ^FO200,210^ADN, 15,5^FDDOB: ^FS
      ^FO255,210^ADN, 15,5^FD${dob} ^FS
      ^FO550,145^ADN, 15,5^FD${lastName}, ^FS
      ^FO550,170^ADN, 15,5^FD${firstName}^FS
      ^XZ`;
  }
}
