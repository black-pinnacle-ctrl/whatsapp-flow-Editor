import type {
  CreateFlowPayload,
  CreateFlowResponse,
  ListFlowsResponse,
  FlowAssetsResponse,
  UploadFlowJsonResponse,
  PublishFlowResponse,
} from './types';

// In browser development, use the Vite proxy path '/api-pinbot' to avoid CORS issues.
// Fallback to direct URL if running outside Vite proxy.
const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.port) {
    return '/api-pinbot/v3/flows';
  }
  return 'https://partnersV1.pinbot.ai/v3/flows';
};

export async function createFlow(
  wabaId: string,
  apiKey: string,
  payload: CreateFlowPayload
): Promise<CreateFlowResponse> {
  const url = `${getBaseUrl()}/${wabaId}/flows`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function listFlows(
  wabaId: string,
  apiKey: string
): Promise<ListFlowsResponse> {
  const url = `${getBaseUrl()}/${wabaId}/flows`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Failed to fetch flows (Status ${response.status})`);
  }

  return data;
}

export async function getFlowAssets(
  flowId: string,
  apiKey: string
): Promise<FlowAssetsResponse> {
  const url = `${getBaseUrl()}/${flowId}/assets`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Failed to fetch flow assets (Status ${response.status})`);
  }

  return data;
}

export async function fetchFlowJsonFromUrl(downloadUrl: string): Promise<unknown> {
  let targetUrl = downloadUrl;
  // If in browser and URL is from mmg.whatsapp.net, use Vite proxy to prevent CORS error
  if (typeof window !== 'undefined' && downloadUrl.startsWith('https://mmg.whatsapp.net')) {
    targetUrl = downloadUrl.replace('https://mmg.whatsapp.net', '/api-whatsapp-mmg');
  }

  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`Failed to download flow JSON (Status ${response.status})`);
  }
  return await response.json();
}

export async function fetchFlowJsonByFlowId(
  flowId: string,
  apiKey: string
): Promise<{ json: unknown; downloadUrl: string }> {
  const assetsRes = await getFlowAssets(flowId, apiKey);
  const flowJsonAsset = assetsRes.data?.find(
    a => a.asset_type === 'FLOW_JSON' || a.name?.endsWith('.json')
  );

  if (!flowJsonAsset || !flowJsonAsset.download_url) {
    throw new Error(`No FLOW_JSON asset found for Flow ID ${flowId}`);
  }

  const json = await fetchFlowJsonFromUrl(flowJsonAsset.download_url);
  return { json, downloadUrl: flowJsonAsset.download_url };
}

export async function uploadFlowJson(
  flowId: string,
  apiKey: string,
  jsonContent: string
): Promise<UploadFlowJsonResponse> {
  const url = `${getBaseUrl()}/${flowId}/assets`;

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const formData = new FormData();
  formData.append('name', 'flow.json');
  formData.append('asset_type', 'FLOW_JSON');
  formData.append('file', blob, 'flow.json');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      // Note: do not set Content-Type header; browser fetch sets multipart/form-data with proper boundary
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDetails = Array.isArray(data?.validation_errors)
      ? data.validation_errors.map((e: { message?: string; error?: string }) => e.message || e.error).join('; ')
      : '';
    throw new Error(errorDetails || data?.error || data?.message || `Failed to upload flow JSON (Status ${response.status})`);
  }

  return data;
}

export async function publishFlow(
  flowId: string,
  apiKey: string
): Promise<PublishFlowResponse> {
  const url = `${getBaseUrl()}/${flowId}/publish`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
    },
    body: '',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Failed to publish flow (Status ${response.status})`);
  }

  return data;
}


