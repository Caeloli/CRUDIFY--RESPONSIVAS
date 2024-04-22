import { faker } from "@faker-js/faker";
import { useState } from "react";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";

/*const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle(["relationship", "complicated", "single"])[0],
  };
};

const newResponsive = () => {
  return {
    resp_id: faker.number.int({ min: 0, max: 10000 }),
    user_id_fk: faker.number.int(),
    state_id_fk_fk: faker.number.int({ min: 1, max: 2 }),
    remedy: "TAS000001069050",
    token: 340861,
    user_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    immediately_chief: faker.person.fullName(),
    windows_server: "vwcapappwp8007.un.pemex.com ",
    domain: "UN",
    account: "GCOADMUS",
    start_date: faker.date.past().toISOString().split("T")[0],
    end_date: faker.date.future().toISOString().split("T")[0],
    file_format: faker.number.int({ min: 3, max: 4 }),
    file_route: "3",
  };
};

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newResponsive(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}

*/

// Convert string to ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export function exportToExcelResponsivesCrud(data) {
  const dataForExcel = data.map((item) => ({
    "Response ID": item.resp_id,
    Estado:
      item.state_id_fk === 1
        ? "Active"
        : item.state_id_fk === 2
        ? "Notificar"
        : item.state_id_fk === 3
        ? "Expirado"
        : item.state_id_fk === 4
        ? "Notificado"
        : item.state_id_fk === 5
        ? "Cancelado"
        : item.state_id_fk === 6
        ? "Renovada"
        : "Se desconoce",
    Remedy: item.remedy,
    "Fecha Inicio": item.start_date,
    "Fecha Fin": item.end_date,
    Formato: item.file_format,
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataForExcel);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate binary Excel data
  const excelBlob = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  // Create a Blob containing the Excel file
  const blob = new Blob([s2ab(excelBlob)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a link element and trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  link.download = `responsivas_${new Date().getTime()}.xlsx`;
  link.click();
}

export function exportToExcelGeneralPanel(data) {
  const dataForExcel = data.map((item) => ({
    "Usuario": item.user_server_username,
    "Correo Electrónico": item.email,
    "Token": item.token,
    "Jefe Inmediato": item.immediately_chief,
    "Correo Jefe Inmediato: ":  item.immediately_chief_email, 
    "Responsiva ID": item.resp_id,
    "Estado":
      item.state_id_fk === 1
        ? "Active"
        : item.state_id_fk === 2
        ? "Notificar"
        : item.state_id_fk === 3
        ? "Expirado"
        : item.state_id_fk === 4
        ? "Notificado"
        : item.state_id_fk === 5
        ? "Cancelado"
        : item.state_id_fk === 6
        ? "Renovada"
        : "Se desconoce",
    "Remedy": item.remedy,
    "Fecha Inicio": new Date(item.start_date).toISOString().split("T")[0],
    "Fecha Fin": new Date(item.end_date).toISOString().split("T")[0],
    "Formato": item.file_format,
    "Marca": item.brand,
    "Modelo": item.model,
    "Ubicación": item.location,
    "Número Serial": item.serial_number,
    "Hostname": item.hostname,
    "Dirección IP": item.ip_address,
    "Dominio": item.domain_server,
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataForExcel);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate binary Excel data
  const excelBlob = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  // Create a Blob containing the Excel file
  const blob = new Blob([s2ab(excelBlob)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a link element and trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  link.download = `general_responsivas_${new Date().getTime()}.xlsx`;
  link.click();
}

export function exportToExcelServersF3Panel(data) {
  const dataForExcel = data.map((item) => ({
    "Hostname": item.hostname,
    "Dirección IP": item.ip_address,
    "Dominio": item.domain_server,
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataForExcel);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate binary Excel data
  const excelBlob = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  // Create a Blob containing the Excel file
  const blob = new Blob([s2ab(excelBlob)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a link element and trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  link.download = `servidoresf3_${new Date().getTime()}.xlsx`;
  link.click();
}

export function exportToExcelServersF4Panel(data) {
  const dataForExcel = data.map((item) => ({
    "Marca": item.brand,
    "Modelo": item.model,
    "Ubicación": item.location,
    "Número Serial": item.serial_number,
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(dataForExcel);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate binary Excel data
  const excelBlob = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  // Create a Blob containing the Excel file
  const blob = new Blob([s2ab(excelBlob)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a link element and trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  link.download = `servidoresf4_${new Date().getTime()}.xlsx`;
  link.click();
}


export function decodeToken() {
  const token = localStorage.getItem("jwt");
  const decodedToken = jwtDecode(token);
  return decodedToken;
}
