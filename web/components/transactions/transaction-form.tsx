"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FieldErrors = {
  type?: string;
  category?: string;
  amount?: string;
  date?: string;
  note?: string;
};


