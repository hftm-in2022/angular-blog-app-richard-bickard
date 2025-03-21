FROM alpine:3.16

# Definiere Argumente
ARG JMETER_VERSION="5.6.2"
ARG JMETER_PLUGINS_MANAGER_VERSION="1.10"
ARG CMDRUNNER_VERSION="2.3"
ARG ALPINE_PACKAGES="openjdk11-jre ca-certificates unzip bash curl"
ARG TEST_PLAN="blog-app-test-plan.jmx"
ARG ENV_PROPERTIES="dev.properties"

# Definiere Umgebungsvariablen
ENV JMETER_HOME /opt/apache-jmeter-${JMETER_VERSION}
ENV JMETER_BIN ${JMETER_HOME}/bin
ENV JMETER_PLUGINS_FOLDER ${JMETER_HOME}/lib/ext
ENV PATH $PATH:$JMETER_BIN
ENV TEST_PLAN=${TEST_PLAN}
ENV ENV_PROPERTIES=${ENV_PROPERTIES}

# Installiere benötigte Pakete
RUN apk update && \
    apk upgrade && \
    apk add --no-cache ${ALPINE_PACKAGES} && \
    mkdir -p /opt && \
    mkdir -p /jmeter/test-files && \
    mkdir -p /jmeter/results

# Lade JMeter herunter und installiere es
RUN cd /opt && \
    curl -L https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz -o jmeter.tgz && \
    tar -xzf jmeter.tgz && \
    rm jmeter.tgz

# Lade das JMeter Plugins Manager herunter und installiere es
RUN cd ${JMETER_PLUGINS_FOLDER} && \
    curl -L https://jmeter-plugins.org/get/ -o jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar && \
    cd /opt && \
    curl -L https://search.maven.org/remotecontent?filepath=kg/apc/cmdrunner/${CMDRUNNER_VERSION}/cmdrunner-${CMDRUNNER_VERSION}.jar -o ${JMETER_HOME}/lib/cmdrunner-${CMDRUNNER_VERSION}.jar

# Installiere JMeter-Plugins
RUN java -cp ${JMETER_PLUGINS_FOLDER}/jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar org.jmeterplugins.repository.PluginManagerCMDInstaller && \
    ${JMETER_HOME}/bin/PluginsManagerCMD.sh install jpgc-graphs-basic jpgc-graphs-additional jpgc-synthesis

# Kopiere die JMeter-Testpläne und Testdaten
COPY load-testing/jmeter/${TEST_PLAN} /jmeter/test-files/
COPY load-testing/jmeter/environments/${ENV_PROPERTIES} /jmeter/test-files/
COPY load-testing/jmeter/test-data/ /jmeter/test-files/test-data/

# Setze Arbeitsverzeichnis
WORKDIR /jmeter

# Definiere das Entrypoint-Skript
COPY load-testing/scripts/docker-entrypoint.sh /jmeter/docker-entrypoint.sh
RUN chmod +x /jmeter/docker-entrypoint.sh

# Führe das Entrypoint-Skript aus
ENTRYPOINT ["/jmeter/docker-entrypoint.sh"]