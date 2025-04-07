# Use official Node.js image as the base image
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the Angular application
RUN npm run build -- --prod

# Use an Nginx image to serve the Angular app
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app from the previous step
COPY --from=build /app/dist/OMP /usr/share/nginx/html


# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
