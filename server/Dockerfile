FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching)
COPY package*.json ./
# Install ALL dependencies (including devDependencies like nodemon if needed, 
# but for prod usually --production. Given we might need prisma generate, let's keep it simple)
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client (Important!)
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
