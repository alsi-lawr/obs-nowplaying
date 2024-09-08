# Stage 1: Build the app
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app
FROM build as publish

# Set the working directory inside the container
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=build /app ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port Next.js will run on
EXPOSE 45000

# Start the Next.js app
CMD ["npm", "start"]

