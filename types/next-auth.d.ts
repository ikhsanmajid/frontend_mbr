import { Session, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
        access_token?: string,
        email?: string,
        id?: number | null,
        is_admin?: boolean,
        is_active?: boolean,
        name?: string,
        bagian_jabatan?: any,
        expires_at?: number | null
    }    
  }
  
  interface User {
    id?: string;
    access_token?: string,
    email?: string,
    is_admin?: boolean,
    is_active?: boolean,
    name?: string,
    bagian_jabatan?: any
    expires?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    access_token?: string;
    email?: string;
    name?: string;
    is_admin?: boolean;
    bagian_jabatan?: any;
    expires_at?: number | null;
  }
}

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}