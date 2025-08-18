// src/api.js
import axios from "axios";

// Central backend URL (update here if it changes)
export const API_BASE_URL = "http://localhost:8080/api";


// ----- Project APIs -----
export async function fetchProjects() {
    const { data } = await axios.get(`${API_BASE_URL}/projects`);
    return data;
}

export async function fetchProjectById(id) {
    const { data } = await axios.get(`${API_BASE_URL}/projects/${id}`);
    return data;
}

export async function submitProposal(proposal) {
    const { data } = await axios.post(`${API_BASE_URL}/proposals`, proposal);
    return data;
}

// ----- User APIs -----
export async function registerUser(userData) {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return data;
}

export async function loginUser(credentials) {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return data;
}
