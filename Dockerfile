FROM debian:jessie

#Install curl, supervisor, openssh-server, git
RUN apt-get update && apt-get install -y curl openssh-server supervisor git
RUN mkdir -p /var/run/sshd /var/log/supervisor

#Install node js
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

#Add authorized_keys for connecting to container
ADD docker/authorized_keys /root/.ssh/authorized_keys

#Copy our supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

#Bundle app source
COPY . /src

#Install app dependencies
RUN cd /src; npm install

EXPOSE  22 8080

#Create file for logging
RUN mkdir -p /logs; touch /logs/msd_log.txt

CMD ["/usr/bin/supervisord"]