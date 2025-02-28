'use client'; 
import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookies';
import { useRouter } from 'next/router';

export interface User {
    id: number; 
    name: string; 
    email: string; 
    username: string; 
    pict
}