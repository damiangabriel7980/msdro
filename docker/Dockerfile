FROM paduraru/docker-node-dev

#REPLACE msd_container_bitbucket with your private bitbucket key and add the key inside a folder named "keys"
ENV your_bitbucket_key msd_container_bitbucket

#Copy private key for bitbucket repo
ADD keys/$your_bitbucket_key /root/.ssh/$your_bitbucket_key
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan -t rsa bitbucket.org >> /root/.ssh/known_hosts
RUN chmod 600 /root/.ssh/*
RUN ls -al /root/.ssh

#Copy our supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

#Add authorized_keys for connecting to container
ADD authorized_keys /root/.ssh/authorized_keys

#Bundle app source
RUN ssh-agent bash -c 'ssh-add /root/.ssh/$your_bitbucket_key; git clone git@bitbucket.org:qualitance/msd-new.git /opt/msd'

WORKDIR /opt/msd

RUN git checkout origin/develop

#Install app dependencies
RUN npm install; bower install --allow-root

EXPOSE  22 8080

#Create file for logging
RUN mkdir -p /logs; touch /logs/msd_log.txt

CMD ["/usr/bin/supervisord"]
#CMD ["/usr/sbin/sshd","-D"]