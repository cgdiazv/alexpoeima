export const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  "United States (US)": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ],
  "Belize (BZ)": [
    "Belize", "Cayo", "Corozal", "Orange Walk", "Stann Creek", "Toledo"
  ],
  "Costa Rica (CR)": [
    "San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"
  ],
  "El Salvador (SV)": [
    "San Salvador", "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión", "Morazán", "San Miguel", "San Vicente", "Santa Ana", "Sonsonate", "Usulután"
  ],
  "Guatemala (GT)": [
    "Guatemala", "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"
  ],
  "Honduras (HN)": [
    "Francisco Morazán", "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
  ],
  "Nicaragua (NI)": [
    "Managua", "Boaco", "Carazo", "Chinandega", "Chontales", "Estelí", "Granada", "Jinotega", "León", "Madriz", "Masaya", "Matagalpa", "Nueva Segovia", "Rivas", "Río San Juan", "RACCN", "RACCS"
  ],
  "Panama (PA)": [
    "Panamá", "Bocas del Toro", "Chiriquí", "Coclé", "Colón", "Darién", "Herrera", "Los Santos", "Panamá Oeste", "Veraguas", "Guna Yala", "Emberá-Wounaan", "Ngäbe-Buglé"
  ],
  "Canada (CA)": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
  ],
  "United Kingdom (UK)": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  "Mexico (MX)": [
    "Ciudad de México", "Jalisco", "Nuevo León", "Estado de México", "Guanajuato", "Puebla", "Veracruz", "Yucatán", "Quintana Roo", "Baja California", "Chihuahua", "Sonora", "Querétaro", "Tamaulipas", "Coahuila", "Sinaloa", "Michoacán", "San Luis Potosí", "Tabasco", "Aguascalientes", "Hidalgo", "Morelos", "Durango", "Zacatecas", "Nayarit", "Campeche", "Oaxaca", "Chiapas", "Guerrero", "Tlaxcala", "Colima", "Baja California Sur"
  ]
};

export const COUNTRIES = Object.keys(REGIONS_BY_COUNTRY);
