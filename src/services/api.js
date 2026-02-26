// src/services/api.js con axios
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/';
const PAYMENTS_CONTEXT = 'payments/api/';
const BOOKSCATALOGUE_CONTEXT = 'catalogue/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// En src/services/api.js
export const bookService = {
  async getAllBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}${BOOKSCATALOGUE_CONTEXT}books`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener libros:', error);
      throw error;
    }
  },

  async getBookById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${BOOKSCATALOGUE_CONTEXT}books/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener libro ${id}:`, error);
      throw error;
    }
  }
};

// Nuevo servicio para pagos
export const paymentService = {
  async createPurchase(bookId, userEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}${PAYMENTS_CONTEXT}purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: bookId,
          userEmail: userEmail
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear la compra:', error);
      throw error;
    }
  },

  // Método con axios si prefieres usarlo
  async createPurchaseAxios(bookId, userEmail) {
    try {
      const response = await api.post(`${API_BASE_URL}${PAYMENTS_CONTEXT}purchases`, {
        bookId: bookId,
        userEmail: userEmail
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear la compra:', error);
      throw error;
    }
  }
};