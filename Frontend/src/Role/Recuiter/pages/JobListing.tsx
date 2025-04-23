"use client"

import type React from "react"

import { useState } from "react"
import NavBar from "../components/NavBar/NavBar"
import { FaBuilding, FaEdit, FaTrashAlt } from "react-icons/fa"

type Job = {
  id: number
  title: string
  hospital: string
  date: string
  location: string
  type: string
  salary: string
  status: string
}

