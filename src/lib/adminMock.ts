// Sample data shown in the admin panel while the database has no real rows yet.
const ago = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export type AdminProject = {
  id: string; title: string; client_name: string; location: string; address: string;
  type: string; sqm: number | null; total_price: number | null; paid: number | null;
  progress: number; status: string; current_phase: string; current_task: string;
  start_date: string | null; end_date: string | null; work_hours: string;
  teams: { name: string; workers: number; role: string }[];
  client_email: string; client_phone: string; mock?: boolean;
};

export const mockProjects: AdminProject[] = [
  { id: "mock-1", title: "Kompletna renovacija stana", client_name: "Ivana Kovač", location: "Trešnjevka", address: "Ozaljska 34", type: "Stan", sqm: 68, total_price: 38450, paid: 16150, progress: 42, status: "izvodenje", current_phase: "Izvođenje", current_task: "Postavljanje keramike u kupaonici", start_date: "2026-09-14", end_date: "2026-12-04", work_hours: "07:30 – 15:30", teams: [{ name: "Keramika Petrović", workers: 2, role: "Keramika" }, { name: "Elektro Grgić", workers: 1, role: "Elektro" }], client_email: "ivana.kovac@example.hr", client_phone: "+385 91 234 5678", mock: true },
  { id: "mock-2", title: "Renovacija kupaonice", client_name: "Josip Radić", location: "Maksimir", address: "Maksimirska 76", type: "Kupaonica", sqm: 7, total_price: 9800, paid: 7350, progress: 75, status: "izvodenje", current_phase: "Izvođenje", current_task: "Montaža sanitarija", start_date: "2026-10-05", end_date: "2026-11-06", work_hours: "08:00 – 14:00", teams: [{ name: "Vodoinstalacije Bašić", workers: 2, role: "Vodoinstalacije" }], client_email: "josip.radic@example.hr", client_phone: "+385 98 765 4321", mock: true },
  { id: "mock-3", title: "Uređenje poslovnog prostora", client_name: "Hrvoje Matić", location: "Donji grad", address: "Preradovićeva 14", type: "Poslovni prostor", sqm: 120, total_price: 52000, paid: 31200, progress: 64, status: "izvodenje", current_phase: "Izvođenje", current_task: "Gletanje i bojanje zidova", start_date: "2026-08-20", end_date: "2026-11-28", work_hours: "07:00 – 15:00", teams: [{ name: "Soboslikar Šimunović", workers: 3, role: "Soboslikarstvo" }], client_email: "hrvoje.matic@example.hr", client_phone: "+385 99 111 2233", mock: true },
  { id: "mock-4", title: "Kompletna renovacija stana", client_name: "Mateo Kralj", location: "Črnomerec", address: "Vrapčanska 18", type: "Stan", sqm: 55, total_price: 31000, paid: 0, progress: 10, status: "ugovor", current_phase: "Ugovor", current_task: "Potpis ugovora", start_date: null, end_date: "2027-02-15", work_hours: "—", teams: [], client_email: "mateo.kralj@example.hr", client_phone: "+385 95 444 5566", mock: true },
  { id: "mock-5", title: "Renovacija kuhinje", client_name: "Lucija Horvat", location: "Trnje", address: "Vukovarska 102", type: "Stan", sqm: 14, total_price: 14200, paid: 0, progress: 5, status: "procjena", current_phase: "Procjena", current_task: "Izlazak na teren", start_date: null, end_date: null, work_hours: "—", teams: [], client_email: "lucija.horvat@example.hr", client_phone: "+385 91 777 8899", mock: true },
  { id: "mock-6", title: "Adaptacija kuće", client_name: "Damir Jurić", location: "Sesvete", address: "Zagrebačka 51", type: "Kuća", sqm: 140, total_price: 74500, paid: 74500, progress: 100, status: "zavrseno", current_phase: "Završeno", current_task: "Predano", start_date: "2026-03-02", end_date: "2026-07-30", work_hours: "—", teams: [], client_email: "damir.juric@example.hr", client_phone: "+385 98 222 3344", mock: true },
];

export type AdminRequest = {
  id: string; created_at: string; name: string; email: string; phone: string; location: string;
  property_type: string; sqm: number | null; scope: string; condition: string; material: string;
  message: string | null; status: string; admin_notes: string | null; estimated_range?: string | null; mock?: boolean;
};

export const mockRequests: AdminRequest[] = [
  { id: "mr-1", created_at: ago(2), name: "Tomislav Babić", email: "tomislav.babic@example.hr", phone: "+385 91 100 2003", location: "Maksimir", property_type: "Stan", sqm: 54, scope: "Kompletna renovacija", condition: "Staro, za kompletnu obnovu", material: "Srednji razred", message: "Zanima me kompletna renovacija stana prije useljenja.", status: "novi", admin_notes: null, estimated_range: "24 – 28k €", mock: true },
  { id: "mr-2", created_at: ago(5), name: "Ana Marić", email: "ana.maric@example.hr", phone: "+385 98 200 3004", location: "Črnomerec", property_type: "Kupaonica", sqm: 6, scope: "Kupaonica", condition: "Dotrajalo", material: "Srednji razred", message: "Želim novu kupaonicu s tušem umjesto kade.", status: "novi", admin_notes: null, estimated_range: "7,5 – 9k €", mock: true },
  { id: "mr-3", created_at: ago(26), name: "Petra Novak", email: "petra.novak@example.hr", phone: "+385 99 300 4005", location: "Sesvete", property_type: "Kuća", sqm: 140, scope: "Kompletna renovacija", condition: "Staro", material: "Viši razred", message: null, status: "novi", admin_notes: null, estimated_range: "68 – 80k €", mock: true },
  { id: "mr-4", created_at: ago(72), name: "Maja Knežević", email: "maja.knezevic@example.hr", phone: "+385 95 400 5006", location: "Špansko", property_type: "Stan", sqm: 72, scope: "Kompletna renovacija", condition: "Solidno", material: "Srednji razred", message: "Sastanak u četvrtak u 17h.", status: "sastanak", admin_notes: null, estimated_range: "30 – 35k €", mock: true },
];

export type AdminContractor = {
  id: string; created_at: string; name: string; profession: string; experience: string; legal_form: string;
  location: string; phone: string; email: string; about: string | null; status: string; admin_notes: string | null; mock?: boolean;
};

export const mockContractors: AdminContractor[] = [
  { id: "mc-1", created_at: ago(4), name: "Zoran Petrović", profession: "Keramičar", experience: "18 god.", legal_form: "Obrt", location: "Zagreb", phone: "+385 91 555 1001", email: "zoran.petrovic@example.hr", about: "Specijaliziran za velike formate i kupaonice.", status: "novo", admin_notes: null, mock: true },
  { id: "mc-2", created_at: ago(30), name: "Ante Grgić", profession: "Električar", experience: "9 god.", legal_form: "d.o.o.", location: "Velika Gorica", phone: "+385 98 555 1002", email: "ante.grgic@example.hr", about: null, status: "u_razmatranju", admin_notes: null, mock: true },
  { id: "mc-3", created_at: ago(80), name: "Marina Šimunović", profession: "Soboslikar", experience: "12 god.", legal_form: "Obrt", location: "Zagreb", phone: "+385 99 555 1003", email: "marina.simunovic@example.hr", about: "Gletanje, bojanje, dekorativne tehnike.", status: "prihvaceno", admin_notes: null, mock: true },
  { id: "mc-4", created_at: ago(120), name: "Krešimir Bašić", profession: "Vodoinstalater", experience: "22 god.", legal_form: "Obrt", location: "Samobor", phone: "+385 95 555 1004", email: "kresimir.basic@example.hr", about: null, status: "prihvaceno", admin_notes: null, mock: true },
];
