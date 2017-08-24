FROM uknetweb/php-5.4-apache

# Copy current build to container Apache document root
COPY ./web /var/www/html

# Enable mod_rewrite
RUN a2enmod rewrite

# Expose the default HTTP port
EXPOSE 80
