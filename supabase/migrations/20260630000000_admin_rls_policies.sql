-- Helper functions for role-based access
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM "User" WHERE email = (auth.jwt() ->> 'email') LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(public.get_user_role() IN ('owner', 'admin'), false);
$$;

CREATE OR REPLACE FUNCTION public.is_authenticated_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(public.get_user_role() IS NOT NULL, false);
$$;

-- User table policies
CREATE POLICY "admin_select_user" ON "User" FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_user" ON "User" FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "staff_select_own_user" ON "User" FOR SELECT TO authenticated USING (email = (auth.jwt() ->> 'email'));

-- Product policies
CREATE POLICY "admin_all_product" ON "Product" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_read_product" ON "Product" FOR SELECT TO authenticated USING (public.is_authenticated_staff());

-- ProductCategory policies
CREATE POLICY "admin_all_product_category" ON "ProductCategory" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_read_product_category" ON "ProductCategory" FOR SELECT TO authenticated USING (public.is_authenticated_staff());

-- Attendance policies
CREATE POLICY "admin_all_attendance" ON "Attendance" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_own_attendance" ON "Attendance" FOR ALL TO authenticated USING (
  "userId" IN (SELECT id FROM "User" WHERE email = (auth.jwt() ->> 'email'))
) WITH CHECK (
  "userId" IN (SELECT id FROM "User" WHERE email = (auth.jwt() ->> 'email'))
);

-- Customer policies
CREATE POLICY "admin_all_customer" ON "Customer" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_read_customer" ON "Customer" FOR SELECT TO authenticated USING (public.is_authenticated_staff());

-- PosBill policies
CREATE POLICY "admin_all_posbill" ON "PosBill" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_read_posbill" ON "PosBill" FOR SELECT TO authenticated USING (public.is_authenticated_staff());

-- CreditCase policies
CREATE POLICY "admin_all_creditcase" ON "CreditCase" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_read_creditcase" ON "CreditCase" FOR SELECT TO authenticated USING (public.is_authenticated_staff());

-- MessengerJob policies
CREATE POLICY "admin_all_messenger" ON "MessengerJob" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_read_messenger" ON "MessengerJob" FOR SELECT TO authenticated USING (public.is_authenticated_staff());

-- Employee policies
CREATE POLICY "admin_all_employee" ON "Employee" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LeaveRequest policies
CREATE POLICY "admin_all_leave" ON "LeaveRequest" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ShopDocumentSettings policies
CREATE POLICY "admin_all_shop_doc" ON "ShopDocumentSettings" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CreditSettings policies
CREATE POLICY "admin_all_credit_settings" ON "CreditSettings" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CashflowLedger policies
CREATE POLICY "admin_all_cashflow" ON "CashflowLedger" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PawnContract policies
CREATE POLICY "admin_all_pawn" ON "PawnContract" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RepairJob policies
CREATE POLICY "admin_all_repair" ON "RepairJob" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Notification policies
CREATE POLICY "admin_all_notification" ON "Notification" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "staff_own_notification" ON "Notification" FOR SELECT TO authenticated USING (
  "userId" IN (SELECT id FROM "User" WHERE email = (auth.jwt() ->> 'email'))
);
