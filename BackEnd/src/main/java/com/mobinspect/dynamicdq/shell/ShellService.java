package com.mobinspect.dynamicdq.shell;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobinspect.dynamicdq.shell.model.ShellServer;
import lombok.extern.log4j.Log4j2;
import org.apache.sshd.client.SshClient;
import org.apache.sshd.client.channel.ClientChannel;
import org.apache.sshd.client.channel.ClientChannelEvent;
import org.apache.sshd.client.session.ClientSession;
import org.apache.sshd.common.channel.Channel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Log4j2
@Service
public class ShellService {
    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final Map<String, ShellServer> servers = new HashMap<>();

    @Value("${servers.path}")
    String serversPath;
    String serversFile;

    @PostConstruct
    void init() {
        serversFile = serversPath + "Servers.json";
        readServers();
    }

    public List<ShellServer> getServers(){
        readServers();
        List<ShellServer> result = new ArrayList<>(servers.keySet().size());
        for (String key : servers.keySet()) {
            ShellServer ds = servers.get(key);
            ds.setName(key);
            result.add(ds);
        }
        result.sort(Comparator.comparingInt(ShellServer::getPosition));
        return result;
    }

    public String executeCmd(ShellServer server, String command) {
        long defaultTimeoutSeconds = 10l;
        SshClient client = SshClient.setUpDefaultClient();
        client.start();

        try (ClientSession session = client.connect(server.getUsername(), server.getIp(), server.getPort())
                .verify(defaultTimeoutSeconds, TimeUnit.SECONDS).getSession()) {
            session.addPasswordIdentity(server.getPassword());
            session.auth().verify(defaultTimeoutSeconds, TimeUnit.SECONDS);

            try (ByteArrayOutputStream responseStream = new ByteArrayOutputStream();
                 ClientChannel channel = session.createChannel(Channel.CHANNEL_SHELL)) {
                channel.setOut(responseStream);
                try {
                    channel.open().verify(defaultTimeoutSeconds, TimeUnit.SECONDS);
                    try (OutputStream pipedIn = channel.getInvertedIn()) {
                        pipedIn.write(command.getBytes());
                        pipedIn.flush();
                    }
                    channel.waitFor(EnumSet.of(ClientChannelEvent.CLOSED), 0);
//                    channel.waitFor(EnumSet.of(ClientChannelEvent.CLOSED),
//                            TimeUnit.SECONDS.toMillis(defaultTimeoutSeconds));
//                    String responseString = new String(responseStream.toByteArray());
//                    System.out.println(responseString);
                } finally {
                    channel.close(false);
                    client.stop();
                }
                return new String(responseStream.toByteArray());
            } catch (IOException ignored){}
        } catch (IOException ignored){}
        return null;
    }

    private void readServers() {
        try {
            Map<String, ShellServer> readServers = OBJECT_MAPPER.readValue(new FileInputStream(serversFile), new TypeReference<TreeMap<String, ShellServer>>() {});
            for(Map.Entry<String, ShellServer> server : readServers.entrySet()){
                String key = server.getKey();
                ShellServer ds = server.getValue();
                servers.put(key, ds);
                log.info("Config param [servers.{}]: [{}]", key, ds.getIp());
            }
        } catch (Exception ex){
            log.error("Ошибка чтения файла с настройками БД [{}]", serversFile);
        }
    }
}
