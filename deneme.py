import random

secure_random = random.SystemRandom()

# Amerikan ruleti renk eşleşmeleri
roulette_colors = {
    1: 'Red', 2: 'Black', 3: 'Red', 4: 'Black', 5: 'Red', 6: 'Black',
    7: 'Red', 8: 'Black', 9: 'Red', 10: 'Black', 11: 'Black', 12: 'Red',
    13: 'Black', 14: 'Red', 15: 'Black', 16: 'Red', 17: 'Black', 18: 'Red',
    19: 'Red', 20: 'Black', 21: 'Red', 22: 'Black', 23: 'Red', 24: 'Black',
    25: 'Red', 26: 'Black', 27: 'Red', 28: 'Black', 29: 'Black', 30: 'Red',
    31: 'Black', 32: 'Red', 33: 'Black', 34: 'Red', 35: 'Black', 36: 'Red',
    0: 'Green', '00': 'Green'
}

# 20 adımlık test_case otomatik üretilir
def generate_test_case():
    base_amount = 25
    case = []
    types = [("Color", "Red"), ("OddEven", "Odd"), ("Color", "Black"), ("OddEven", "Even")]
    for i in range(20):
        t, val = types[i % len(types)]
        case.append((t, val, base_amount * (2 ** i)))
    return case

test_case = generate_test_case()

def martingale_simulation(balance: int):
    deck = list(range(1, 37)) + [0, '00']

    for step, (bet_type, expected, amount) in enumerate(test_case, 1):
        if balance < amount:
            return balance, False, step, None, None

        draw = secure_random.choice(deck)
        color = roulette_colors[draw]

        if bet_type == "Color":
            is_win = (color.lower() == expected.lower())
        elif bet_type == "OddEven":
            is_win = (draw % 2 == 1) if expected.lower() == "odd" and isinstance(draw, int) else \
                     (draw % 2 == 0) if expected.lower() == "even" and isinstance(draw, int) else False

        balance -= amount
        if is_win:
            balance += amount * 2
            return balance, True, step, draw, color

    return balance, False, 20, draw, color  # 20. adımda da kaybettiyse

def run_until_first_20th_step_failure(start_balance=500000000, max_rounds=100000):
    for i in range(1, max_rounds + 1):
        balance, success, step, draw, color = martingale_simulation(start_balance)
        if not success and step == 20:
            return {
                "Stopped At Round": i,
                "Reason": "Failure at 20th step",
                "Drawn Number": draw,
                "Drawn Color": color,
                "Remaining Balance": balance,
                "Step": step
            }
    return {
        "Status": f"No 20th-step failure in {max_rounds} rounds."
    }

# ▶️ Çalıştır
result = run_until_first_20th_step_failure()
print(result)
