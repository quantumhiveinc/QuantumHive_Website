'use client';

// src/components/ServicesList.tsx
import { useState, useEffect } from 'react';

interface Service {
  id: number;
  title: string;
  description: string | null;
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          console.error('Failed to fetch services:', await response.text());
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching services:', error.message);
        } else {
          console.error('Unknown error fetching services:', error);
        }
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <h2>Services List</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}