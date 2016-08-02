#
# Copyright 2016 Scott J. Johnson (https://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# 
# VolumePercentChangeFromAverage
#
# Shows the current bar volume as a percentage change of the average volume
# over the last X bars. Volume higher than the threshold is shown in yello
#

declare lower;
declare zerobase;

input length = 50;
input highVolThresholdPercent = 40;  # 40% above average

plot VolPercent = (volume / Average(volume, length) - 1 ) * 100;

VolPercent.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
VolPercent.SetLineWeight(3);
VolPercent.HideBubble();
VolPercent.AssignValueColor(if VolPercent > highVolThresholdPercent then GetColor(4) else GetColor(1));

plot AverageVol = 0.0;
AverageVol.SetDefaultColor(Color.WHITE);
AverageVol.SetLineWeight(2);
AverageVol.HideBubble();
