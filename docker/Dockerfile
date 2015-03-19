FROM debian:jessie

#Install curl, supervisor, openssh-server, openssh-client, git
RUN apt-get update && apt-get install -y curl openssh-server supervisor git
RUN mkdir -p /var/run/sshd /var/log/supervisor

#Install node js
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

#Install bower
RUN npm install -g bower

#Copy private key for bitbucket repo
ADD keys/id_rsa /root/.ssh/id_rsa
ADD keys/id_rsa.pub /root/.ssh/id_rsa.pub
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
RUN chmod 600 /root/.ssh/*
RUN ls -al /root/.ssh

#Copy our supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

#Add authorized_keys for connecting to container
ADD authorized_keys /root/.ssh/authorized_keys

#Bundle app source
RUN git clone git@bitbucket.org:qualitance/msd-new.git /opt/msd

#Install app dependencies
RUN cd /opt/msd; npm install; bower install --allow-root

EXPOSE  22 8080

#Create file for logging
RUN mkdir -p /logs; touch /logs/msd_log.txt

#CMD ["/usr/bin/supervisord"]
CMD ["/usr/sbin/sshd","-D"]