import { useEffect, useState } from "react";
import { Box, Text, Flex, Badge, Spinner } from "@chakra-ui/react";
import { getPresenceStats, type GetPresenceStatsReply } from "../../services/presence_service"; // ajusta ruta

export const PresenceStatsCard = () => {
    const [stats, setStats] = useState<GetPresenceStatsReply | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await getPresenceStats();
                setStats(result);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <Flex align="center" justify="center" p={4}>
                <Spinner />
            </Flex>
        );
    }

    if (!stats) {
        return (
            <Box p={4} bg="red.50" border="1px solid" borderColor="red.200" rounded="md">
                <Text color="red.700">No se pudo obtener la información.</Text>
            </Box>
        );
    }

    const { total, online } = stats.data;

    return (
        <Box
            p={5}
            shadow="md"
            borderRadius="lg"
            borderWidth="1px"
            bg="white"
            maxW="320px"
        >
            <Text fontSize="lg" fontWeight="bold" mb={3}>
                Estado de Usuarios
            </Text>

            <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Usuarios conectados:</Text>
                <Badge colorScheme="green">{online}</Badge>
            </Flex>

            <Flex justify="space-between">
                <Text fontWeight="semibold">Usuarios totales:</Text>
                <Badge colorScheme="blue">{total}</Badge>
            </Flex>
        </Box>
    );
};