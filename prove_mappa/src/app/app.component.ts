import { Component, OnInit } from '@angular/core';
import { CrimesService } from './crimes.service';
import * as L from 'leaflet';  // Importa Leaflet

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  geojsonData:any; // Dati GeoJSON che contengono sia la geometria che il numero di crimini

  constructor(private crimesService: CrimesService) { }

  map!: L.Map;

  ngOnInit(): void {
    this.initMap();
    this.loadData(); // Carica il file GeoJSON
  }

  // Funzione per inizializzare la mappa
  initMap(): void {
    this.map = L.map('map', {
      center: [41.816813771373916, -87.60670812560372],  // Coordinate centrali per Chicago
      zoom: 14
    });

    // Aggiungi il layer di base di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  // Funzione per caricare i dati (crimini e distretti) da un file GeoJSON
  loadData(): void {
    this.crimesService.getCrimes().subscribe(
      (data) => {
        console.log('Dati GeoJSON ricevuti:', data);
        this.geojsonData = data;
        console.log(this.geojsonData);
        // Aggiungi i distretti e i crimini alla mappa
        this.addDistrictsToMap(this.geojsonData);
      },
      (error) => {
        console.error('Errore nel recupero dei dati:', error);
      }
    );
  }

  // Funzione per aggiungere i distretti con il numero di crimini alla mappa
  addDistrictsToMap(data: any): void {
  
    L.geoJSON(data, {
      style: {
        color: 'blue',   // Border color
        weight: 2,       // Border thickness
        opacity: 1       // Border opacity
      },
      onEachFeature: (feature, layer) => {
        // Check for the required properties to avoid undefined errors
        const neighborhood = feature.properties?.pri_neigh || "Unknown";
        const crimeCount = feature.properties?.crime_count || 0;
        layer.bindPopup(`
          <strong>${neighborhood}</strong><br/>
          Crimini: ${crimeCount}`);
      }
    }).addTo(this.map); // Add to map
  
}
}
