import sys
import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import User, Farmer, ProcurementCentre, Crop, Slot, Booking, Queue, Procurement, Payment, Notification
from app.services.auth import get_password_hash
from app.services.queue_service import QueueService

def seed_database():
    print("[SEED] Rebuilding database tables and seeding KisanQ demo data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # 1. Admin User
        admin_user = User(
            name="DoCA Admin Officer",
            mobile_number="9999999999",
            password_hash=get_password_hash("admin123"),
            role="ADMIN"
        )
        db.add(admin_user)
        db.commit()

        # 2. Operators (3 centres)
        operators_data = [
            ("Ramesh Operator (Pune)", "8888888881", "operator123"),
            ("Suresh Operator (Nashik)", "8888888882", "operator123"),
            ("Mahesh Operator (Nagpur)", "8888888883", "operator123"),
        ]
        operators = []
        for name, mobile, pwd in operators_data:
            u = User(
                name=name,
                mobile_number=mobile,
                password_hash=get_password_hash(pwd),
                role="OPERATOR"
            )
            db.add(u)
            operators.append(u)
        db.commit()

        # 3. Procurement Centres (3 centres)
        centres_data = [
            ("Pune Central APMC Procurement Centre", "Market Yard, Gultekdi, Pune", "Pune", "Maharashtra", 60, 8),
            ("Nashik Grain Procurement Hub", "Panchavati Market Yard, Nashik", "Nashik", "Maharashtra", 50, 10),
            ("Nagpur Agricultural Mandi", "Kalamna Market Yard, Nagpur", "Nagpur", "Maharashtra", 50, 12),
        ]
        centres = []
        for name, addr, dist, state, cap, avg_t in centres_data:
            c = ProcurementCentre(
                name=name,
                address=addr,
                district=dist,
                state=state,
                capacity=cap,
                average_processing_time=avg_t,
                status="ACTIVE"
            )
            db.add(c)
            centres.append(c)
        db.commit()

        # 4. Crops (4 crops)
        crops_data = [
            ("Wheat (Gehun)", "Quintal"),
            ("Rice (Chawal / Paddy)", "Quintal"),
            ("Maize (Makka)", "Quintal"),
            ("Gram (Chana)", "Quintal")
        ]
        crops = []
        for cname, unit in crops_data:
            cr = Crop(name=cname, unit=unit, status="ACTIVE")
            db.add(cr)
            crops.append(cr)
        db.commit()

        # 5. Slots for today & tomorrow
        today_str = datetime.date.today().strftime("%Y-%m-%d")
        tomorrow_str = (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        
        time_slots = [
            ("09:00", "09:30"),
            ("09:30", "10:00"),
            ("10:00", "10:30"),
            ("10:30", "11:00"),
            ("11:00", "11:30"),
            ("11:30", "12:00"),
            ("14:00", "14:30"),
            ("14:30", "15:00")
        ]

        slots = []
        for centre in centres:
            for date_s in [today_str, tomorrow_str]:
                for st, et in time_slots:
                    sl = Slot(
                        centre_id=centre.id,
                        date=date_s,
                        start_time=st,
                        end_time=et,
                        capacity=15,
                        booked_count=0,
                        status="AVAILABLE"
                    )
                    db.add(sl)
                    slots.append(sl)
        db.commit()

        # 6. Farmers (20 farmers)
        farmers_data = [
            ("Rajesh Farmer", "9876543210", "FARM-2026-001", "Khed", "Pune", "Maharashtra", "Marathi"),
            ("Sunil Patil", "9876543211", "FARM-2026-002", "Baramati", "Pune", "Maharashtra", "Marathi"),
            ("Anil Deshmukh", "9876543212", "FARM-2026-003", "Haveli", "Pune", "Maharashtra", "Marathi"),
            ("Vikas Shinde", "9876543213", "FARM-2026-004", "Shirur", "Pune", "Maharashtra", "English"),
            ("Sanjay Pawar", "9876543214", "FARM-2026-005", "Daund", "Pune", "Maharashtra", "Hindi"),
            ("Ganesh Jadhav", "9876543215", "FARM-2026-006", "Niphad", "Nashik", "Maharashtra", "Marathi"),
            ("Prakash Kadam", "9876543216", "FARM-2026-007", "Sinnar", "Nashik", "Maharashtra", "Marathi"),
            ("Deepak More", "9876543217", "FARM-2026-008", "Yeola", "Nashik", "Maharashtra", "Marathi"),
            ("Santosh Gaikwad", "9876543218", "FARM-2026-009", "Malegaon", "Nashik", "Maharashtra", "Marathi"),
            ("Nitin Thorat", "9876543219", "FARM-2026-010", "Chandwad", "Nashik", "Maharashtra", "Marathi"),
            ("Rameshwar Bhagat", "9876543220", "FARM-2026-011", "Katol", "Nagpur", "Maharashtra", "Marathi"),
            ("Manoj Wagh", "9876543221", "FARM-2026-012", "Saoner", "Nagpur", "Maharashtra", "Marathi"),
            ("Harishchandra Raut", "9876543222", "FARM-2026-013", "Umred", "Nagpur", "Maharashtra", "Marathi"),
            ("Dnyaneshwar Mahajan", "9876543223", "FARM-2026-014", "Ramtek", "Nagpur", "Maharashtra", "Marathi"),
            ("Bapurao Kharde", "9876543224", "FARM-2026-015", "Narkhed", "Nagpur", "Maharashtra", "Marathi"),
            ("Pandurang Salunke", "9876543225", "FARM-2026-016", "Indapur", "Pune", "Maharashtra", "Marathi"),
            ("Subhash Gite", "9876543226", "FARM-2026-017", "Junnar", "Pune", "Maharashtra", "Marathi"),
            ("Eknath Dhonde", "9876543227", "FARM-2026-018", "Ambegaon", "Pune", "Maharashtra", "Marathi"),
            ("Maroti Kamble", "9876543228", "FARM-2026-019", "Purandar", "Pune", "Maharashtra", "Marathi"),
            ("Kiran Shelke", "9876543229", "FARM-2026-020", "Bhor", "Pune", "Maharashtra", "English")
        ]

        farmers = []
        for name, mobile, fid, vil, dist, st, lang in farmers_data:
            u = User(
                name=name,
                mobile_number=mobile,
                password_hash=get_password_hash("farmer123"),
                role="FARMER"
            )
            db.add(u)
            db.commit()
            db.refresh(u)

            f = Farmer(
                user_id=u.id,
                farmer_id=fid,
                village=vil,
                district=dist,
                state=st,
                preferred_language=lang
            )
            db.add(f)
            db.commit()
            db.refresh(f)
            farmers.append(f)

        # 7. Create 20 Bookings across Pune centre (centre_id=1) & Nashik (centre_id=2)
        pune_centre = centres[0]
        nashik_centre = centres[1]

        statuses = [
            "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED",
            "PROCESSING", "CALLED",
            "ARRIVED", "ARRIVED", "WAITING", "WAITING", "WAITING", "WAITING", "WAITING",
            "BOOKED", "BOOKED", "BOOKED", "BOOKED", "BOOKED", "BOOKED"
        ]

        rates = [2275.0, 2275.0, 2183.0, 2090.0, 5440.0]

        for i, farmer in enumerate(farmers):
            c_id = pune_centre.id if i < 14 else nashik_centre.id
            crop_obj = crops[i % 4]
            slot_obj = slots[i % 8] # Slot for today
            status_val = statuses[i]

            slot_obj.booked_count += 1
            token_str = f"A{101 + i}"
            booking_code = f"BK-2026-001{i+1:02d}"
            exp_qty = 30.0 + (i * 2.5)

            booking = Booking(
                booking_id=booking_code,
                farmer_id=farmer.id,
                centre_id=c_id,
                crop_id=crop_obj.id,
                slot_id=slot_obj.id,
                token=token_str,
                expected_quantity=exp_qty,
                status=status_val
            )
            db.add(booking)
            db.commit()
            db.refresh(booking)

            # Queue entry
            q_status = status_val if status_val in ["ARRIVED", "WAITING", "CALLED", "PROCESSING", "COMPLETED"] else "WAITING"
            queue_item = Queue(
                booking_id=booking.id,
                queue_position=i + 1,
                status=q_status,
                arrival_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=120 - i*5),
                estimated_wait_time=max(0, (i - 5) * 8)
            )
            db.add(queue_item)
            db.commit()

            # Procurement & Payment records for COMPLETED items
            if status_val == "COMPLETED":
                act_qty = exp_qty - 2.0
                rate_val = rates[i % len(rates)]
                total_amt = act_qty * rate_val

                proc = Procurement(
                    booking_id=booking.id,
                    expected_quantity=exp_qty,
                    actual_quantity=act_qty,
                    rate=rate_val,
                    total_amount=total_amt,
                    quality_grade="Grade A",
                    status="COMPLETED",
                    remarks="Standard moisture & grain quality passed.",
                    completed_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=60 - i*10)
                )
                db.add(proc)
                db.commit()
                db.refresh(proc)

                pay_status = "COMPLETED" if i < 3 else "PROCESSING"
                pay = Payment(
                    procurement_id=proc.id,
                    amount=total_amt,
                    status=pay_status,
                    transaction_id=f"PAY-2026-0098{i+1:02d}",
                    payment_date=datetime.datetime.utcnow() if pay_status == "COMPLETED" else None
                )
                db.add(pay)
                db.commit()

            # Initial Notifications for farmer
            notif1 = Notification(
                farmer_id=farmer.id,
                type="BOOKING_CONFIRMED",
                message=f"✓ Booking {booking_code} confirmed at {pune_centre.name if c_id==1 else nashik_centre.name}. Token: {token_str}",
                is_read=True
            )
            db.add(notif1)
            if status_val in ["COMPLETED", "PROCESSING", "CALLED"]:
                notif2 = Notification(
                    farmer_id=farmer.id,
                    type="TURN_APPROACHING",
                    message=f"🔔 Token {token_str}: Your turn is approaching. Please proceed to procurement counter.",
                    is_read=False
                )
                db.add(notif2)
            db.commit()

        # Recalculate centre queues
        QueueService.recalculate_centre_queue(db, pune_centre.id)
        QueueService.recalculate_centre_queue(db, nashik_centre.id)

        print("\n[SUCCESS] Database seeding completed successfully!")
        print("--------------------------------------------------")
        print("DEMO LOGIN CREDENTIALS:")
        print("1. FARMER:")
        print("   Mobile: 9876543210 | Password: farmer123 (Token: A101 - Completed)")
        print("   Mobile: 9876543215 | Password: farmer123 (Token: A106 - Processing)")
        print("   Mobile: 9876543217 | Password: farmer123 (Token: A108 - Arrived/Waiting)")
        print("2. OPERATOR:")
        print("   Mobile: 8888888881 | Password: operator123 (Pune Procurement Centre)")
        print("3. ADMINISTRATOR:")
        print("   Mobile: 9999999999 | Password: admin123")
        print("--------------------------------------------------\n")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
