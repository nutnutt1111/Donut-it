export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Attendance: {
        Row: {
          clockIn: string | null;
          clockOut: string | null;
          dateKey: string;
          id: string;
          isLate: boolean;
          lateDeductionSatang: number | null;
          lateMinutes: number | null;
          lateReviewRequired: boolean;
          note: string | null;
          status: string;
          userId: string;
          workMode: string;
        };
        Insert: {
          clockIn?: string | null;
          clockOut?: string | null;
          dateKey: string;
          id: string;
          isLate?: boolean;
          lateDeductionSatang?: number | null;
          lateMinutes?: number | null;
          lateReviewRequired?: boolean;
          note?: string | null;
          status?: string;
          userId: string;
          workMode?: string;
        };
        Update: {
          clockIn?: string | null;
          clockOut?: string | null;
          dateKey?: string;
          id?: string;
          isLate?: boolean;
          lateDeductionSatang?: number | null;
          lateMinutes?: number | null;
          lateReviewRequired?: boolean;
          note?: string | null;
          status?: string;
          userId?: string;
          workMode?: string;
        };
        Relationships: [];
      };
      CreditCase: {
        Row: {
          approvedAt: string | null;
          assignedToId: string | null;
          caseNo: string;
          closedAt: string | null;
          createdAt: string;
          createdById: string | null;
          customerId: string;
          customerNameSnapshot: string;
          customerPhoneSnapshot: string | null;
          deviceBrand: string | null;
          deviceModel: string | null;
          downAmount: number;
          downPercent: number;
          financedAmount: number;
          id: string;
          monthlyPayment: number;
          platform: string;
          preliminaryApprovalStatus: string;
          salePrice: number;
          status: string;
          termMonths: number;
          totalPayable: number;
          totalProfit: number;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      Customer: {
        Row: {
          address: string | null;
          createdAt: string;
          creditLimit: number | null;
          id: string;
          idCard: string | null;
          name: string;
          phone: string | null;
          taxId: string | null;
          type: string;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      Employee: {
        Row: {
          createdAt: string;
          currentDailyWageSatang: number;
          employeeCode: string;
          employmentStatus: string;
          employmentType: string;
          id: string;
          nickname: string | null;
          phone: string | null;
          position: string;
          userId: string;
          workEndTime: string;
          workStartTime: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      MessengerJob: {
        Row: {
          address: string | null;
          approvedAt: string | null;
          baseFee: number;
          createdAt: string;
          customerName: string;
          distanceKm: number;
          estimatedProfit: number;
          fee: number;
          id: string;
          needsApproval: boolean;
          note: string | null;
          phone: string | null;
          promoType: string;
          scheduledAt: string;
          status: string;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      PosBill: {
        Row: {
          billNo: string;
          createdAt: string;
          createdById: string | null;
          customerId: string | null;
          discount: number;
          fee: number;
          grossProfit: number | null;
          id: string;
          isDeleted: boolean;
          items: Json;
          notes: string | null;
          paidCash: number;
          paidTransfer: number;
          paymentMethod: string;
          saleType: string;
          status: string;
          subtotal: number;
          total: number;
          tradeInAmount: number;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      Product: {
        Row: {
          barcode: string | null;
          category: string;
          categoryId: string | null;
          cost: number;
          createdAt: string;
          description: string | null;
          id: string;
          minStock: number;
          name: string;
          price: number;
          serialNumber: string | null;
          status: string;
          stock: number;
          updatedAt: string;
          wholesalePrice: number;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      ProductCategory: {
        Row: {
          createdAt: string;
          id: string;
          isActive: boolean;
          name: string;
          skuPrefix: string;
          sortOrder: number;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      ShopDocumentSettings: {
        Row: {
          autoPrintOnComplete: boolean;
          createdAt: string;
          defaultPrintFormat: string;
          footerText: string | null;
          id: string;
          logoUrl: string | null;
          shopAddress: string;
          shopName: string;
          shopPhone: string;
          taxId: string | null;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      User: {
        Row: {
          avatar: string | null;
          email: string | null;
          id: string;
          monthlyTarget: number | null;
          name: string;
          role: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
