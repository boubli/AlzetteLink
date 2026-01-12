# Contributing to AlzetteLink

Thank you for your interest in contributing to AlzetteLink! This project is designed as an educational platform, and contributions from students are especially welcome.

## 🎯 How to Contribute

### For Students (Lycée Technique)

1. **Start with the Student Tasks** in the README.md
2. Fork this repository
3. Create a feature branch: `git checkout -b feature/my-improvement`
4. Make your changes
5. Test your changes locally
6. Commit with a clear message: `git commit -m "Add humidity sensor support"`
7. Push and create a Pull Request

### For Developers

1. Check the [Issues](https://github.com/boubli/AlzetteLink/issues) for open tasks
2. Comment on an issue to claim it
3. Follow the same branch/PR workflow above

## 📁 Project Structure

```
AlzetteLink/
├── bridge-service/    # Node.js MQTT → InfluxDB bridge
├── web-dashboard/     # React frontend
├── firmware/          # ESP32 C++ code
├── simulator/         # Test without hardware
└── mosquitto/         # MQTT broker config
```

## 🔧 Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/boubli/AlzetteLink.git
cd AlzetteLink

# 2. Start infrastructure
docker-compose up -d

# 3. Install dependencies
cd bridge-service && npm install && cd ..
cd web-dashboard && npm install && cd ..
cd simulator && npm install && cd ..

# 4. Run the simulator + dashboard
# Terminal 1:
cd simulator && npm start

# Terminal 2:
cd web-dashboard && npm run dev
```

## 📝 Code Style

- **JavaScript/React**: Use ESLint defaults
- **C++**: Follow Arduino style conventions
- **Commits**: Use present tense ("Add feature" not "Added feature")

## 🧪 Testing

Before submitting a PR, ensure:

1. `npm run lint` passes in `web-dashboard`
2. The dashboard connects and displays data
3. No console errors in browser

## 💡 Ideas for Contributions

- Add new sensor types (humidity, pressure, motion)
- Improve the dashboard UI/UX
- Add data export functionality
- Create an alert/notification system
- Add multi-language support
- Write unit tests

## 📫 Questions?

Open an issue or contact [Boubli Tech](https://boubli.tech).

---

**Happy Coding!** 🚀
